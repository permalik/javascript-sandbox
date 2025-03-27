{
  description = "javascript_curricula";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/release-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = false;
        };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.alejandra
            pkgs.nodejs_23
            pkgs.pnpm_9
          ];

          shellHook = ''
            # Custom Prompt
            export PS1="\n\[\e[1;32m\][devshell](.venv) \w\n❯ \[\e[0m\]"
          '';
        };
      }
    );
}
