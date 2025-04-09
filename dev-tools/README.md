# Homey Developer Tools

For easier access to Homey running on your Docker it is recommended to install
the Homey developer tools.

This allows the following conveniences:

```bash
$ homey console
$ homey log

# Also some convenient shortcuts for interacting with the docker itself:
$ homey up           # bring docker up
$ homey halt         # or take it down
$ homey pristine     # or totally destroy it and set up a fresh one
$ homey ssh          # SSH into your VM
$ homey ssh pwd      # or run an arbitrary shell command on the VM
$ homey guard        # start guard
```

## Installation

### Option 1 (recommended): Add the dev tools to your $PATH

To install, add the ./bin directory to your $PATH in your shell's init file
(i.e. `~/.bashrc`, `~/.zshrc`, or wherever yours lives):

```bash
export HOMEY_DIR="$HOME/projects/homey"
export PATH="$HOMEY_DIR/dev-tools/bin:$PATH"
```

Adjust `$HOMEY_DIR` as necessary to reflect the path to the root of your projects.

### Option 2: Create a symlink

Alternatively, you can symlink the script into a directory already in your path:

```bash
ln -s ~/homey/dev-tools/bin/homey ~/bin/
```

## Troubleshooting

Get http://%2Fvar%2Frun%2Fdocker.sock/v1.40/containers/json: dial unix /var/run/docker.sock: connect: permission denied

Create the docker group.

```bash
sudo groupadd docker
```

Add your user to the docker group.

```bash
sudo usermod -aG docker ${USER}
```

Type the following command to re-evaluated the groups.

```bash
su -s ${USER}
```

Verify that you can run docker commands without sudo.

```bash
docker run hello-world
```

If it doesn't work try to restart your computer.

```bash
reboot
```
