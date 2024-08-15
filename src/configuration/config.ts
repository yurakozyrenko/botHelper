export default (): any =>
  ({
    HTTP_PORT: Number(process.env.HTTP_PORT),
  }) as const;
