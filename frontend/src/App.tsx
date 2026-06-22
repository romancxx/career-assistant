import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CvEditor } from "@/features/cv-editor";
import { Generate } from "@/features/pitch-generation";
import { Profile } from "@/features/profile";
import { TailorCv } from "@/features/tailor-cv";
import { Layout } from "@/components/navigation/Layout";
import { queryClient } from "@/lib/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Generate />} />

            <Route path="/cv" element={<TailorCv />} />

            <Route path="/cv-editor" element={<CvEditor />} />

            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
