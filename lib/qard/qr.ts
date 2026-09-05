function channel(value: number) {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(first: string, second: string) {
  const luminance = (hex: string) => {
    const value = Number.parseInt(hex.slice(1), 16);
    const red = channel((value >> 16) & 255);
    const green = channel((value >> 8) & 255);
    const blue = channel(value & 255);
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}
