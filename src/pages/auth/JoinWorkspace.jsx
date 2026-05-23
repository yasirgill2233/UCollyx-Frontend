import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { triggerToast } from "../../utils/toastHelper";
import { useAcceptInviteMutation, useCheckInvite } from "../../hooks/useWorkspace";

export default function JoinWorkspace() {
  // const [searchParams] = useSearchParams();
  // const token = searchParams.get("token");
  // const navigate = useNavigate();

  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  // const [inviteData, setInviteData] = useState(null);
  // const [loading, setLoading] = useState(true);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (password !== confirmPassword) {
  //     const audio = new Audio("/sounds/short_bongo.mp3");
  //     audio.volume = 0.5;
  //     audio.play().catch((e) => console.log("Sound blocked"));
  //     return triggerToast("Passwords do not match","error")
  //   };

  //   setIsLoading(true);
  //   try {
  //     const res = await API.post("/workspace/accept-invite", {
  //       token,
  //       password,
  //     });

  //     localStorage.setItem("token", res.data.token);
  //     localStorage.setItem("user", JSON.stringify(res.data.user));

  //    triggerToast("Account created and Workspace joined!","success")
  //     navigate(`/`);
  //   } catch (err) {
  //     triggerToast(err.response?.data?.message || "Something went wrong","error")
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     try {
  //       const res = await API.get(`/workspace/check-invite/${token}`);
  //       console.log(res);
  //       setInviteData(res.data.data);

  //       await API.post("/workspace/accept-invite", {
  //         token,
  //       });
  //     } catch (err) {
  //       triggerToast(err?.response?.data?.message || "Invlid Link","error")
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   verifyToken();
  // }, [token]);


  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // React Query: Fetch Invite Data
  const { data: inviteRes, isLoading: isVerifying } = useCheckInvite(token);
  const inviteData = inviteRes?.data;

  // React Query: Mutation for Accepting Invite
  const acceptMutation = useAcceptInviteMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      new Audio("/sounds/short_bongo.mp3").play().catch(() => {});
      return triggerToast("Passwords do not match", "error");
    }

    acceptMutation.mutate({ token, password }, {
      onSuccess: (res) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        triggerToast("Account created and Workspace joined!", "success");
        navigate(`/`);
      },
      onError: (err) => {
        triggerToast(err.response?.data?.message || "Something went wrong", "error");
      }
    });
  };

  // UI States from Mutations
  const isSubmitting = acceptMutation.isPending;

  if (isVerifying) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <span className="ml-3 font-bold text-slate-600">Verifying Invite...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {inviteData?.exists ? (
        <div className="text-center">
          <p>
            Welcome back! You already have an account with {inviteData.email}
          </p>
          <button onClick={handleSubmit}>Join Workspace</button>
        </div>
      ) : (
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Blue Header */}
          <div className="bg-indigo-600 p-8 text-center text-white">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-2xl font-bold">You've been invited!</h2>
            <p className="text-indigo-100 text-sm">
              Set up your password to join the team
            </p>
          </div>

          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Create Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  className="w-full border border-gray-200 rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  className="w-full border border-gray-200 rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Accept Invitation & Join"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
