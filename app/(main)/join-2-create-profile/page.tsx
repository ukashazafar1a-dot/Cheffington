import { Suspense } from "react";
import JoinToCreateProfileForm from "./_components/JoinToCreateProfileForm";

const CreateProfileForm = () => {
  return (
    <Suspense fallback={<div className="page-width py-20 text-center">Loading...</div>}>
      <JoinToCreateProfileForm />
    </Suspense>
  );
};

export default CreateProfileForm; 