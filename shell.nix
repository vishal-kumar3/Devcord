# shell.nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "dev-shell";

  buildInputs = with pkgs; [
    nodejs_20
    nodePackages.pnpm
    nodePackages.prisma
    openssl
  ];

  shellHook = ''
    echo "🚀 Development environment ready!"
    export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
  '';
}
