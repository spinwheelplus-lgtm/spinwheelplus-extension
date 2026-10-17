export type RandomNumberDisplayScale = {
  gridClass: string;
  textClass: string;
  tileClass: string;
};

export const getRandomNumberDisplayScale = (
  count: number,
): RandomNumberDisplayScale => {
  if (count <= 1) {
    return {
      gridClass: "grid-cols-1",
      textClass: "text-6xl font-bold sm:text-7xl md:text-8xl",
      tileClass: "min-h-44 sm:min-h-52",
    };
  }
  if (count <= 3) {
    return {
      gridClass: "grid-cols-1 sm:grid-cols-3",
      textClass: "text-4xl font-bold sm:text-5xl",
      tileClass: "min-h-32",
    };
  }
  if (count <= 6) {
    return {
      gridClass: "grid-cols-2 sm:grid-cols-3",
      textClass: "text-3xl font-bold sm:text-4xl",
      tileClass: "min-h-28",
    };
  }
  if (count <= 10) {
    return {
      gridClass: "grid-cols-2 sm:grid-cols-5",
      textClass: "text-2xl font-bold sm:text-3xl",
      tileClass: "min-h-24",
    };
  }
  return {
    gridClass: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6",
    textClass: "text-xl font-bold sm:text-2xl",
    tileClass: "min-h-20",
  };
};
