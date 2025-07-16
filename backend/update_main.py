import fileinput
import sys

# Read the current main.py
with open('app/main.py', 'r') as f:
    content = f.read()

# Add metrics import after dashboard import
content = content.replace(
    'from app.api.endpoints import dashboard',
    'from app.api.endpoints import dashboard, metrics'
)

# Find where dashboard router is included and add metrics router after it
if 'app.include_router(dashboard.router' in content:
    # Find the line with dashboard router
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'app.include_router(dashboard.router' in line:
            # Insert metrics router after dashboard router
            indent = len(line) - len(line.lstrip())
            metrics_line = ' ' * indent + 'app.include_router(metrics.router, prefix="/api/v1/metrics", tags=["metrics"])'
            lines.insert(i + 1, metrics_line)
            break
    content = '\n'.join(lines)

# Write the updated content
with open('app/main.py', 'w') as f:
    f.write(content)

print("Updated main.py to include metrics router")
