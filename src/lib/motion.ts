export const ease = [0.22, 0.61, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
  exit: { opacity: 0, y: -10, filter: "blur(10px)", transition: { duration: 0.55, ease } },
};
