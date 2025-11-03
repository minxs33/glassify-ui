# Changelog

## [1.0.0] - 2025-10-31
### Added
- Core `Glassify` component with support for:
  - `blur`, `tint`, `shine`, `turbulence`, and `displacement` effects
  - Built-in `effectPreset` system for easy visual customization
  - Theming with `light` and `dark` mode support
  - Custom `z-index`, `color`, and `borderRadius` options
- Fully typed with TypeScript definitions
- Works in both SSR and CSR environments
- Designed to integrate seamlessly with React + Tailwind setups

---

## [1.0.2] - 2025-11-02
### Fixed
- Added `use client` compatibility flag
- Improved SSR handling and encoding normalization for inline SVG filters

## [1.0.3] - 2025-11-04
### Fixed
- Added README.md and CHANGELOG.md
- Fixing shine custom rgb normalizer
- Removing Color props for future plan
- Fixing <Glassify> default values