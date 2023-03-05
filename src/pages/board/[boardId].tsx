import withFirebaseProtection from "@/auth/withFirebaseProtection";
import AppLayout from "@/components/layouts/AppLayout";
import React from "react";

const BoardDetails = () => {
  return (
    <AppLayout>
      <div>Board Details</div>
    </AppLayout>
  );
};

export default withFirebaseProtection(BoardDetails);
