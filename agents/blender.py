from pygltflib import GLTF2

# GLTF 파일 경로
gltf_file_path = "untitled.glb"

# GLTF 파일 로드
gltf = GLTF2().load(gltf_file_path)

# 최상위 노드 정보 출력
print("Top-Level Nodes in the GLTF File:")
for node_index, node in enumerate(gltf.nodes):
    print(f"Node {node_index}:")
    print(f"  Name: {node.name}")
    print(f"  Children: {node.children if node.children else 'None'}")
    print(f"  Mesh: {node.mesh if node.mesh else 'None'}")
    print(f"  Skin: {node.skin if node.skin else 'None'}")

# 스켈레톤(Bone) 정보 출력 (있는 경우)
print("\nBones/Skeletons in the GLTF File:")
if gltf.skins:
    for skin_index, skin in enumerate(gltf.skins):
        print(f"Skin {skin_index}:")
        print(f"  Joints: {skin.joints}")
        print(f"  Skeleton Root: {skin.skeleton}")
else:
    print("No Skins or Bones found in the GLTF file.")
