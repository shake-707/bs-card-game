export const getUserId = (): string => {
  return (window as any).USER_ID || "";
};
