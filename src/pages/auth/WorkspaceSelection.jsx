import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Users, Loader2 } from "lucide-react"; // Icons add kiye
import API from "../../api/axios";

export default function WorkspaceSelection() {
    const navigate = useNavigate();
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const checkUserWorkspaces = async () => {
        try {
            const res = await API.get('/workspace/my-workspaces');
            const list = res.data.data;
            console.log(list)

            // if (list.length === 1) {
            //     // Agar sirf 1 workspace hai, auto-redirect to dashboard
            //     // navigate(`/${list[0].slug}/dashboard`);
            //     navigate("/workspace-selection");
            // } else if (list.length > 1) {
            //     // Agar 1 se zyada hain, to list state mein save karein (Select mode)
            //     setWorkspaces(list);
            // }
            // Agar 0 hain, to screen ruk kar options dikhayegi (Create/Join)
        } catch (err) {
            console.error("Workspace fetch failed", err);
        } finally {
            setLoading(false);
        }
    };
    checkUserWorkspaces();
}, [navigate]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
            {/* Stepper */}
            <div className="flex items-center w-full max-w-md mb-12">
                <div className="flex items-center w-full">
                    <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <div className="flex-auto border-t-2 border-indigo-600"></div>
                </div>
                <div className="flex items-center w-full">
                    <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <div className="flex-auto border-t-2 border-indigo-600"></div>
                </div>
                <div className="w-8 h-8 shrink-0 bg-indigo-600 border-2 border-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
            </div>

            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-3">How would you like to start?</h1>
                <p className="text-gray-500">Choose an option to begin setting up your collaboration environment</p>
            </div>

            {/* Cards Container */}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
                
                {/* Create Workspace Card */}
                <div onClick={() => navigate("/workspace-setup")} className="flex-1 border-2 border-gray-100 rounded-3xl p-8 flex flex-col items-center text-center hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer group bg-white">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-100">
                        <LayoutGrid className="text-indigo-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Create a workspace</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                        Set up a new dedicated space for your team or organisation from scratch.
                    </p>
                </div>

                {/* Join/Select Workspace Card */}
                <div onClick={() => navigate("/join-workspace")} className="flex-1 border-2 border-gray-100 rounded-3xl p-8 flex flex-col items-center text-center hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer group bg-white">
                    <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-100">
                        <Users className="text-cyan-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        {workspaces.length > 1 ? "Select a workspace" : "Join a workspace"}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                        {workspaces.length > 1 
                            ? `You are a member of ${workspaces.length} workspaces. Click to choose one.` 
                            : "Connect with your team by entering a workspace invite code."}
                    </p>
                </div>
            </div>
        </div>
    );
}