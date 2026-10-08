"use client";

import SearchBar from "@/components/ui/SearchBar";
import { AllNotesViewer } from "@/components/ui/PersonalNotes";

/** Rail actions for project walkthroughs: in-page search and the all-notes dialog. */
export default function ProjectTools() {
  return (
    <>
      <SearchBar trigger />
      <AllNotesViewer />
    </>
  );
}
