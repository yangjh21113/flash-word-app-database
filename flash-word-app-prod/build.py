#!/usr/bin/env python3
"""
构建脚本 — 将 libraries/ 嵌套结构聚合为 app 所需的扁平 JSON

输出到 build/ 目录，保持与 cloud.js 旧接口完全兼容
"""

import json
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
LIB_DIR = os.path.join(ROOT, "libraries")
BUILD_DIR = os.path.join(ROOT, "build")

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  → {os.path.relpath(path, ROOT)}")

def walk_nodes(nodes_dir, lib_id, seasons_map, episodes_map, words_map, parent_id=""):
    """递归遍历 nodes/ 目录，聚合到旧格式
    parent_id: 父节点的 _id（用于拼接完整 episode ID）
    """
    # 尝试多个位置找 nodes.json
    nodes_file = None
    for candidate in [
        os.path.join(nodes_dir, "nodes.json"),
        os.path.join(nodes_dir, "nodes", "nodes.json"),
    ]:
        if os.path.exists(candidate):
            nodes_file = candidate
            break

    if not nodes_file:
        return

    nodes_list = load_json(nodes_file)
    for node in nodes_list:
        nid = node.get("_id", "")
        # 尝试多个路径：直接子目录 或 nodes/ 子目录
        node_dir = None
        for candidate in [
            os.path.join(nodes_dir, nid),
            os.path.join(nodes_dir, "nodes", nid),
            os.path.join(nodes_dir, nid.replace(lib_id + "_", "")),
            os.path.join(nodes_dir, "nodes", nid.replace(lib_id + "_", "")),
        ]:
            if os.path.exists(candidate):
                node_dir = candidate
                break
        if not node_dir:
            continue

        node_meta_file = os.path.join(node_dir, "meta.json")
        if os.path.exists(node_meta_file):
            node_meta = load_json(node_meta_file)
        else:
            node_meta = node

        # 判断是中间节点还是叶子节点
        child_nodes = None
        for candidate in [
            os.path.join(node_dir, "nodes.json"),
            os.path.join(node_dir, "nodes", "nodes.json"),
        ]:
            if os.path.exists(candidate):
                child_nodes = candidate
                break
        if child_nodes:
            # 中间节点 → season（ID 不加 lib_ 前缀）
            short_id = nid.replace(lib_id.replace("lib_", "") + "_", "")
            if nid not in seasons_map:
                seasons_map[nid] = {
                    "_id": short_id,
                    "name": node_meta.get("name", nid),
                    "total": node_meta.get("total", 0),
                    "episodes": 0,
                    "_node_dir": node_dir  # 临时字段，用于后续计数
                }
            walk_nodes(node_dir, lib_id, seasons_map, episodes_map, words_map, nid)
        else:
            # 叶子节点 → episode（ID 不加 lib_ 前缀）
            short_id = nid.replace(lib_id.replace("lib_", "") + "_", "")
            full_id = f"{parent_id.replace(lib_id+'_', '')}{nid}" if parent_id else nid
            episodes_map.setdefault(full_id, []).append({
                "_id": full_id,
                "name": node_meta.get("name", nid),
                "total": node_meta.get("total", 0)
            })
            # 读取 words.json
            words_file = os.path.join(node_dir, "words.json")
            if os.path.exists(words_file):
                words = load_json(words_file)
                if full_id not in words_map:
                    words_map[full_id] = []
                words_map[full_id].extend(words)
            # 给父 season 计数
            if parent_id and parent_id in seasons_map:
                seasons_map[parent_id]["episodes"] += 1

def main():
    print("🔨 构建数据...")

    # 读取 config
    categories = load_json(os.path.join(ROOT, "config", "categories.json"))
    libraries_index = load_json(os.path.join(ROOT, "config", "libraries.json"))

    # 聚合每个词库
    all_libs = []
    all_episodes = {}

    for lib_meta in libraries_index:
        lib_id = lib_meta["_id"]
        lib_key = lib_id.replace("lib_", "")
        lib_dir = os.path.join(LIB_DIR, lib_key)

        if not os.path.exists(lib_dir):
            print(f"  ⚠️  跳过: {lib_key} 目录不存在")
            continue

        # 加载词库元数据
        meta = load_json(os.path.join(lib_dir, "meta.json"))

        # 递归聚合 nodes
        seasons_map = {}
        episodes_map = {}
        words_map = {}
        nodes_dir = os.path.join(lib_dir, "nodes")
        if os.path.exists(nodes_dir):
            walk_nodes(nodes_dir, lib_id, seasons_map, episodes_map, words_map)

        # 清理临时字段，构建 seasons 列表
        seasons = []
        for s in seasons_map.values():
            season = {k: v for k, v in s.items() if k != "_node_dir"}
            seasons.append(season)
        total = sum(s.get("total", 0) for s in seasons)

        # 兼容无 season 的扁平结构（如 IELTS：词库 → 章节 → 单词）
        # 叶子节点直接作为 pseudo-season，使 total 正确展示
        if not seasons and episodes_map:
            for ep_id, eps in episodes_map.items():
                if eps:
                    ep = eps[0]
                    seasons.append({
                        "_id": ep_id,
                        "name": ep.get("name", ep_id),
                        "total": ep.get("total", 0),
                        "episodes": 1
                    })
            total = sum(s.get("total", 0) for s in seasons)

        # 构建旧格式 libraries.json 条目
        all_libs.append({
            "_id": lib_id,
            "name": meta.get("name", lib_key),
            "desc": meta.get("desc", ""),
            "category": meta.get("category", "other"),
            "type": meta.get("type", "series"),
            "total": total,
            "seasons": seasons
        })

        # 合并 episodes
        for ep_id, eps in episodes_map.items():
            all_episodes.setdefault(ep_id, []).extend(eps)

        # 直接保存当前词库的 words 文件
        if words_map:
            save_json(os.path.join(BUILD_DIR, "words", f"{lib_id}.json"), words_map)

    # 按 seasonId 组织 episodes（旧格式）
    episodes_by_season = {}
    for lib in all_libs:
        lib_id = lib["_id"]
        lib_prefix = lib_id + "_"
        for season in lib.get("seasons", []):
            sid = season["_id"]
            ep_list = []
            for ep_id, eps in all_episodes.items():
                if ep_id.startswith(sid):
                    ep_list.extend(eps)
            if ep_list:
                episodes_by_season.setdefault(lib_id, {})
                episodes_by_season[lib_id][sid] = ep_list

    # 保存 build 产物
    save_json(os.path.join(BUILD_DIR, "categories.json"), categories)
    save_json(os.path.join(BUILD_DIR, "libraries.json"), all_libs)

    for lib_id, season_map in episodes_by_season.items():
        save_json(os.path.join(BUILD_DIR, "episodes", f"{lib_id}.json"), season_map)

    print(f"\n✅ 构建完成! 共 {len(all_libs)} 个词库")

if __name__ == "__main__":
    main()
