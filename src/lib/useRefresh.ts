import { useQueryClient } from "@tanstack/react-query";

export function useRefresh() {
  const queryClient = useQueryClient();

  async function refresh(key: string) {
    await queryClient.invalidateQueries({ queryKey: [key] });
  }
  return refresh;
}
