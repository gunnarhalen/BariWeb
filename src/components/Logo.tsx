import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({
  width = 120,
  height = 30,
  className = "",
}: LogoProps) {
  return (
    <Image
      src="/bari_logo.svg"
      alt="Bari Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
