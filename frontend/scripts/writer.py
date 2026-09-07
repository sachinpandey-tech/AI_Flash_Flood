# Helper to write files
import sys, os

def write(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Wrote {filepath}')

def append(filepath, content):
    with open(filepath, 'a', encoding='utf-8') as f:
        f.write(content)
