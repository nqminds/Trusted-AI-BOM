
# Installation Guide for `vc_tools_cli`

This guide will walk you through installing the necessary tools to build and run the `vc_tools_cli` on your system, including the installation of Cargo (Rust's package manager) and the protobuf compiler.

## Prerequisites

Ensure that you have the following installed on your system:
- **Rust** (including Cargo)
- **Protobuf Compiler (`protoc`)**

### Step 1: Install Rust and Cargo

1. First, install Rust and Cargo. Cargo is Rust’s package manager and build system, which will help us compile the `vc_tools_cli` package.
   
   On Ubuntu-based systems, you can install Rust by running the following:

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. After installation, you will need to restart your terminal or run the following to configure your shell environment:
   
   ```bash
   source $HOME/.cargo/env
   ```

3. Verify that Cargo has been installed correctly:
   
   ```bash
   cargo --version
   ```

### Step 2: Install Protobuf Compiler (`protoc`)

The `vc_tools_cli` project depends on the Protobuf Compiler (`protoc`). You need to install it on your system.

1. **Install Protobuf Compiler**:
   
   On Ubuntu-based systems, use the following command to install `protobuf-compiler`:

   ```bash
   sudo apt update
   sudo apt install protobuf-compiler
   ```

   If the package isn't available, you can also download it directly from [the Protobuf GitHub releases page](https://github.com/protocolbuffers/protobuf/releases).

2. Verify that `protoc` has been installed correctly:

   ```bash
   protoc --version
   ```

   If you get the version output like `libprotoc 3.x.x`, you're good to go.

### Step 3: Clone the `vc_tools_cli` Repository

Clone the repository that contains the `vc_tools_cli` project to your local machine:

```bash
git clone https://github.com/nqminds/Verifiable-Credential-Tools.git
cd Verifiable-Credential-Tools/vc_tools_cli
```

### Step 4: Build and Install `vc_tools_cli` Globally

1. Use Cargo to build the project and install the binary:

   ```bash
   cargo install --path .
   ```

   This will compile and install `vc_tools_cli` globally, making the `vc_tools_cli` command available from anywhere.

2. After the build completes, Cargo will place the `vc_tools_cli` binary in the `~/.cargo/bin` directory.

### Step 5: Add Cargo's Bin Directory to Your PATH (if needed)

If the `vc_tools_cli` command doesn't work immediately, it may be because the `~/.cargo/bin` directory is not in your `PATH`. You can add it to your `PATH` by following these steps:

1. Open your `.bashrc` file for editing:

   ```bash
   nano ~/.bashrc
   ```

2. Add the following line to the end of the file:

   ```bash
   export PATH="$HOME/.cargo/bin:$PATH"
   ```

3. Save and close the file, then source it to apply the changes:

   ```bash
   source ~/.bashrc
   ```

### Step 6: Verify the Installation

Once the `vc_tools_cli` binary is in your `PATH`, you can check if it was installed successfully by running:

```bash
vc_tools_cli --help
```

You should see the help message for the `vc_tools_cli` command.

---

## Troubleshooting

- **Protoc not found**: If `protoc` is not found after installing the Protobuf compiler, ensure that the path to the `protoc` binary is in your system's `PATH` environment variable.
  
- **Cargo build errors**: Ensure that all dependencies are installed, including the Protobuf compiler, and that you have the correct version of Rust and Cargo.
