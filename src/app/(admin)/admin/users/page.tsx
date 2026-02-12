"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Shield } from "lucide-react";

interface UserRow {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
    status: string;
    lastLoginAt: string | null;
}

const ROLES = ["super_admin", "editor", "author", "user"];

export default function UsersPage() {
    const [userList, setUserList] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const [usersRes, meRes] = await Promise.all([
                fetch("/api/users").then((r) => r.json()),
                fetch("/api/users/me").then((r) => r.json()),
            ]);
            setUserList(usersRes.data || []);
            setCurrentUserId(meRes.id || null);
        } catch (e) {
            console.error("Fetch users error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (id: string, role: string) => {
        setUpdatingId(id);
        try {
            await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });
            fetchUsers();
        } catch (e) {
            console.error(e);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "suspended" ? "active" : "suspended";
        setUpdatingId(id);
        try {
            await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchUsers();
        } catch (e) {
            console.error(e);
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDate = (d: string | null) => {
        if (!d) return "Never";
        return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    const isSelf = (id: string) => id === currentUserId;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-light text-gray-100">Users</h1>

            <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin text-gray-500" size={24} />
                    </div>
                ) : userList.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-sm">No users found.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-neutral-900 text-gray-200 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-3">User</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Last Login</th>
                                <th className="p-3 w-24"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-700">
                            {userList.map((user) => (
                                <tr key={user.id} className={`transition-colors ${isSelf(user.id) ? "bg-blue-950/20" : "hover:bg-neutral-750"}`}>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            {user.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={user.image} alt="" className="w-7 h-7 rounded-full object-cover border border-neutral-600" />
                                            ) : (
                                                <div className="w-7 h-7 bg-neutral-700 rounded-full flex items-center justify-center text-[10px] text-gray-400 border border-neutral-600">
                                                    {(user.name || user.email)[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-gray-200 font-medium">{user.name || "—"}</span>
                                                {isSelf(user.id) && (
                                                    <span className="text-[10px] bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                        <Shield size={8} /> You
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-gray-400">{user.email}</td>
                                    <td className="p-3">
                                        {isSelf(user.id) ? (
                                            <span className="text-xs text-gray-400 capitalize">{user.role.replace("_", " ")}</span>
                                        ) : (
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                disabled={updatingId === user.id}
                                                className="bg-neutral-900 border border-neutral-700 text-gray-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                            >
                                                {ROLES.map((r) => (
                                                    <option key={r} value={r}>{r.replace("_", " ")}</option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${user.status === "active" ? "bg-green-600/20 text-green-400" : user.status === "suspended" ? "bg-red-600/20 text-red-400" : "bg-yellow-600/20 text-yellow-400"}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-500 text-xs">{formatDate(user.lastLoginAt)}</td>
                                    <td className="p-3">
                                        {isSelf(user.id) ? (
                                            <span className="text-xs text-gray-600">—</span>
                                        ) : (
                                            <button
                                                onClick={() => handleToggleStatus(user.id, user.status)}
                                                disabled={updatingId === user.id}
                                                className={`text-xs px-2 py-1 rounded border transition-colors ${user.status === "suspended" ? "border-green-700 text-green-400 hover:bg-green-600/10" : "border-red-700 text-red-400 hover:bg-red-600/10"} disabled:opacity-50`}
                                            >
                                                {updatingId === user.id ? <Loader2 size={10} className="animate-spin inline" /> : user.status === "suspended" ? "Activate" : "Suspend"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
