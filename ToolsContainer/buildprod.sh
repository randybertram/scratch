podman build --no-cache -t devtools .
podman stop prod
podman rm prod
podman run -it --name prod -v ~/git:/root/git -v ~/tmp:/root/tmp devtools
