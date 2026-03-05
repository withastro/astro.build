{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-25.11";

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_24
  ];
}