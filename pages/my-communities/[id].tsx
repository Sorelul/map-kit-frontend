import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ArrowLeftIcon, GlobeIcon } from "@heroicons/react/solid";
import { useAuth0 } from "@auth0/auth0-react";
import { Formik, Field, Form } from "formik";

import AuthWidget from "../../components/auth-widget";
import CommunityForm from "../../components/community-form";
import ErrorScreen from "../../components/error-screen";
import LoadingScreen from "../../components/loading-screen";

export default function MyCommunity() {
  const [community, setCommunity] = React.useState(null);
  const router = useRouter();
  const { id } = router.query;
  const { getAccessTokenSilently } = useAuth0();
  const [requestFailed, setRequestFailed] = React.useState(false);

  const { error } = useSWR(
    id
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/communities-admin/${id}/`
      : null,
    async (url) => {
      const token = await getAccessTokenSilently();
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await res.json();
      setCommunity(response);
    }
  );

  async function handleSubmit(values) {
    const token = await getAccessTokenSilently();
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/communities-admin/${id}/`,
      {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => {
      if (response.status !== 200) {
        setRequestFailed(true);
      } else {
        router.back();
      }
    });
  }

  if (error) {
    console.error(error);
    return <ErrorScreen />;
  }
  if (!community) {
    return <LoadingScreen />;
  }
  return (
    <>
      <AuthWidget />
      <div className="flex w-screen items-center justify-center bg-gray-200">
        <div className="flex flex-col mt-20 mb-20 w-2/3 gap-5 px-20 py-12 drop-shadow-2xl bg-white rounded-xl overflow-auto">
          <div className="flex w-full justify-end">
            <button onClick={() => router.back()}>
              <ArrowLeftIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          <CommunityForm
            initialValues={community}
            onSubmit={handleSubmit}
            requestFailed={requestFailed}
          />
        </div>
      </div>
    </>
  );
}
