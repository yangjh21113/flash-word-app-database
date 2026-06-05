#!/usr/bin/env python3
"""
JSON 数据校验脚本 — 检查语法 + 结构一致性

用法：
  python3 validate.py          # 校验所有文件
  python3 validate.py --fix    # 自动修复尾随逗号等常见格式问题
"""

import json
import os
import sys
import re
import glob

DB_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # 根目录
PROD_DIR = os.path.join(DB_DIR, "flash-word-app-prod")  # 生产数据目录

errors = []
warnings = []


def err(msg):
    errors.append(msg)
    print(f"  ❌ {msg}")


def warn(msg):
    warnings.append(msg)
    print(f"  ⚠️  {msg}")


def ok(msg):
    print(f"  ✅ {msg}")


def load_json(filepath):
    """尝试解析 JSON 文件，返回 (data, error)"""
    if not os.path.exists(filepath):
        return None, f"文件不存在: {filepath}"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    try:
        return json.loads(content), None
    except json.JSONDecodeError as e:
        return None, f"{filepath} JSON 解析失败: {e}"


def fix_trailing_commas(filepath):
    """移除尾随逗号并写回"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    fixed = re.sub(r',(\s*[\]}])', r'\1', content)
    if fixed != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed)
        print(f"   已修复 {os.path.relpath(filepath, PROD_DIR)}")
        return True
    return False


# ─── 1. 校验所有 JSON 语法 ────────────────────────────────

def validate_json_syntax():
    print("\n 步骤 1: JSON 语法检查")
    json_files = glob.glob(os.path.join(PROD_DIR, '**/*.json'), recursive=True)
    json_files = [f for f in json_files
                  if '/build/' not in f and '/raw-data/' not in f and '/node_modules/' not in f]
    if not json_files:
        err("未找到任何 .json 文件")
        return {}

    parsed = {}
    for f in sorted(json_files):
        rel = os.path.relpath(f, PROD_DIR)
        data, e = load_json(f)
        if e:
            err(f"{rel}: {e}")
        else:
            ok(f"{rel} ✓")
            parsed[rel] = data
    return parsed


# ─── 2. 校验 config/categories.json ───────────────────────

def validate_categories(parsed):
    print("\n 步骤 2: config/categories.json 结构")
    key = 'config/categories.json'
    if key not in parsed:
        err("缺少 config/categories.json")
        return set()

    cats = parsed[key]
    if not isinstance(cats, list):
        err("categories.json 必须为数组")
        return set()

    keys = set()
    for c in cats:
        if not isinstance(c, dict):
            err(f"categories.json 中元素不是对象: {c}")
            continue
        if 'key' not in c or 'name' not in c:
            err(f"categories.json 缺少 key/name: {c}")
        else:
            keys.add(c['key'])
            ok(f"  分类: {c['key']} - {c['name']}")

    return keys


# ─── 3. 校验 config/libraries.json ───────────────────────

def validate_libraries_index(parsed, valid_cats):
    print("\n 步骤 3: config/libraries.json 结构")
    key = 'config/libraries.json'
    if key not in parsed:
        err("缺少 config/libraries.json")
        return {}

    libs = parsed[key]
    if not isinstance(libs, list):
        err("libraries.json 必须为数组")
        return {}

    lib_ids = {}
    for lib in libs:
        lid = lib.get('_id', '???')
        lib_key = lid.replace("lib_", "")
        lib_ids[lid] = lib

        for field in ['_id', 'name', 'category', 'type']:
            if field not in lib:
                err(f"lib {lid} 缺少字段: {field}")

        cat = lib.get('category', '')
        if cat and valid_cats and cat not in valid_cats:
            err(f"lib {lid} 的分类 '{cat}' 不在 categories.json 中")

        # 检查对应的 libraries/{key}/ 目录是否存在
        lib_dir = os.path.join(PROD_DIR, 'libraries', lib_key)
        if not os.path.exists(lib_dir):
            err(f"lib {lid} 对应的目录 libraries/{lib_key}/ 不存在")
        else:
            meta_file = os.path.join(lib_dir, 'meta.json')
            if not os.path.exists(meta_file):
                err(f"libraries/{lib_key}/meta.json 不存在")
            else:
                ok(f"  词库: {lib.get('name', '???')} ({lib_key}/)")

    return lib_ids


# ─── 4. 校验 libraries/ 嵌套结构 ─────────────────────────

def validate_libraries_structure(lib_ids):
    print("\n 步骤 4: libraries/ 嵌套结构")
    for lid, lib in lib_ids.items():
        lib_key = lid.replace("lib_", "")
        lib_dir = os.path.join(PROD_DIR, 'libraries', lib_key)
        if not os.path.exists(lib_dir):
            continue

        # 检查 nodes/ 目录
        nodes_dir = os.path.join(lib_dir, 'nodes')
        if not os.path.exists(nodes_dir):
            warn(f"libraries/{lib_key}/ 缺少 nodes/ 目录")
            continue

        nodes_file = os.path.join(nodes_dir, 'nodes.json')
        if not os.path.exists(nodes_file):
            warn(f"libraries/{lib_key}/nodes/ 缺少 nodes.json")
            continue

        nodes_data, e = load_json(nodes_file)
        if e:
            err(f"libraries/{lib_key}/nodes/nodes.json: {e}")
            continue

        if not isinstance(nodes_data, list):
            err(f"libraries/{lib_key}/nodes/nodes.json 必须为数组")
            continue

        ok(f"  {lib_key}/: {len(nodes_data)} 个子节点")

        for node in nodes_data:
            nid = node.get('_id', '')
            node_dir = os.path.join(nodes_dir, nid)
            if not os.path.exists(node_dir):
                # 尝试 nodes/nid
                node_dir = os.path.join(nodes_dir, 'nodes', nid)
            if not os.path.exists(node_dir):
                err(f"  {lib_key}/nodes/{nid}/ 目录不存在")
                continue

            # 检查 meta.json
            meta_file = os.path.join(node_dir, 'meta.json')
            if not os.path.exists(meta_file):
                warn(f"  {lib_key}/nodes/{nid}/ 缺少 meta.json")

            # 检查是否继续嵌套或有 words.json
            child_nodes = os.path.join(node_dir, 'nodes.json')
            if not os.path.exists(child_nodes):
                child_nodes = os.path.join(node_dir, 'nodes', 'nodes.json')

            if os.path.exists(child_nodes):
                # 中间节点
                ok(f"    {nid}/: 中间节点")
            else:
                # 叶子节点
                words_file = os.path.join(node_dir, 'words.json')
                if os.path.exists(words_file):
                    words, we = load_json(words_file)
                    if we:
                        err(f"    {nid}/words.json: {we}")
                    else:
                        ok(f"    {nid}/: 叶子节点, {len(words)} 词")
                else:
                    warn(f"    {nid}/: 叶子节点但无 words.json")


# ─── 5. 校验 build/ 产物（如果存在）───────────────────────

def validate_build_output():
    print("\n 步骤 5: build/ 产物检查")
    build_dir = os.path.join(DB_DIR, 'flash-word-app-prod', 'build')
    if not os.path.exists(build_dir):
        warn("build/ 目录不存在，运行 'npm run build' 生成")
        return

    required = ['categories.json', 'libraries.json']
    for f in required:
        path = os.path.join(build_dir, f)
        if not os.path.exists(path):
            err(f"build/{f} 不存在")
        else:
            ok(f"build/{f} ✓")

    episodes_dir = os.path.join(build_dir, 'episodes')
    words_dir = os.path.join(build_dir, 'words')
    if os.path.exists(episodes_dir):
        ep_files = glob.glob(os.path.join(episodes_dir, '*.json'))
        ok(f"build/episodes/: {len(ep_files)} 个文件")
    if os.path.exists(words_dir):
        word_files = glob.glob(os.path.join(words_dir, '*.json'))
        ok(f"build/words/: {len(word_files)} 个文件")


# ─── main ─────────────────────────────────────────────────

def main():
    fix_mode = '--fix' in sys.argv

    if fix_mode:
        print(" 修复模式: 尝试修复 JSON 语法错误\n")
        fixed = False
        json_files = glob.glob(os.path.join(PROD_DIR, '**/*.json'), recursive=True)
        json_files = [f for f in json_files
                      if '/build/' not in f and '/raw-data/' not in f and '/node_modules/' not in f]
        for f in sorted(json_files):
            if fix_trailing_commas(f):
                fixed = True
        if not fixed:
            print("  无需修复")
        print()

    parsed = validate_json_syntax()
    if not parsed:
        print("\n 存在 JSON 语法错误，请先修复后重试")
        sys.exit(1)

    valid_cats = validate_categories(parsed)
    lib_ids = validate_libraries_index(parsed, valid_cats)
    validate_libraries_structure(lib_ids)
    validate_build_output()

    print()
    if errors:
        print(f" {len(errors)} 个错误, {len(warnings)} 个警告")
        sys.exit(1)
    elif warnings:
        print(f" 校验通过! {len(warnings)} 个警告")
        sys.exit(0)
    else:
        print(" 全部校验通过!")
        sys.exit(0)


if __name__ == '__main__':
    main()
