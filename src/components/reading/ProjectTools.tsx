"use client";

import SearchBar from "@/components/ui/SearchBar";
import { AllNotesViewer } from "@/components/ui/PersonalNotes";

/** Rail actions for project walkthroughs: in-page search (only where the project has an index) and the all-notes dialog. */
export default function ProjectTools({ slug }: { slug: string }) {
  return (
    <>
      <SearchBar slug={slug} trigger />
      <AllNotesViewer />
    </>
  );
}
