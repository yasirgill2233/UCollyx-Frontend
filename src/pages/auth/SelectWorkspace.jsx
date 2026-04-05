import { useLocation, useNavigate } from "react-router-dom";

export default function SelectWorkspace() {
    const location = useLocation();
    const navigate = useNavigate();
    const workspaces = location.state?.workspaces || [];
    const user = JSON.parse(localStorage.getItem("user"));

    const handleEnterWorkspace = (ws) => {
        if (user.role === "dev") {
            navigate(`/dev/dashboard`);
        } else if (user.role === "qa") {
            navigate(`/qa/dashboard`);
        } else if (user.role === "manager") {
            navigate(`/manager/portfolio`);
        } 
        else if (user.role === "org_ardmin") {
            navigate(`/org-admin/dashboard`);
        } 
        else {
            navigate(`/admin/dashboard`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Select your workspace</h2>
            <div className="grid gap-4 w-full max-w-md">
                {workspaces.map((ws) => (
                    <button
                        key={ws.id}
                        onClick={() => handleEnterWorkspace(ws)}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xl">
                            {ws.name.charAt(0)}
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-700 group-hover:text-indigo-600">{ws.name}</h3>
                            <p className="text-xs text-gray-400">ucollyx.com/{ws.slug}</p>
                        </div>
                    </button>
                ))}
            </div>
{/*             
            <button 
                onClick={() => navigate("/workspace-selection")}
                className="mt-8 text-indigo-600 font-medium hover:underline"
            >
                + Create new workspace
            </button> */}
        </div>
    );
}