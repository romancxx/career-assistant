import axios from "axios";

export function toMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { message?: string })?.message ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
