import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Shield, 
  UserPlus, 
  MoreVertical, 
  Trash2, 
  ShieldCheck, 
  Eye, 
  Edit3,
  Search,
  Filter,
  Check,
  X,
  Mail,
  Copy,
  Clock,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { db, collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, handleFirestoreError, OperationType } from '../firebase';
import { User, UserRole, Invite } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export const UserManagement = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Invite Form State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('viewer');
  const [isInviting, setIsInviting] = useState(false);
  const [lastInviteLink, setLastInviteLink] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;

    // Listen for users
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id
      })) as User[];
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    // Listen for invites
    const unsubscribeInvites = onSnapshot(collection(db, 'invites'), (snapshot) => {
      const invitesData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Invite[];
      setInvites(invitesData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'invites');
    });

    return () => {
      unsubscribeUsers();
      unsubscribeInvites();
    };
  }, [isAdmin]);

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      setEditingId(null);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.uid) {
      alert("You cannot delete your own account.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user? This will only remove their profile from the database, not their authentication record.")) {
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    setIsInviting(true);
    try {
      const inviteData = {
        email: inviteEmail,
        role: inviteRole,
        invitedBy: currentUser?.uid,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      const docRef = await addDoc(collection(db, 'invites'), inviteData);
      const inviteLink = `${window.location.origin}?invite=${docRef.id}`;
      setLastInviteLink(inviteLink);
      setInviteEmail('');
    } catch (error) {
      console.error("Error sending invite:", error);
      alert("Failed to create invitation. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    if (window.confirm("Are you sure you want to revoke this invitation?")) {
      try {
        await deleteDoc(doc(db, 'invites', inviteId));
      } catch (error) {
        console.error("Error revoking invite:", error);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Invite link copied to clipboard!");
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const pendingInvites = invites.filter(i => i.status === 'pending');

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <Shield className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg font-medium">Access Denied</p>
        <p className="text-sm">You do not have permission to manage users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Management</h1>
          <p className="text-slate-500 text-sm mt-1">Control access levels and invite new members to the platform</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <UserPlus className="w-5 h-5" />
          <span>Invite Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Users Table */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Active Members
            </h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-48"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-bottom border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {filteredUsers.map((u) => (
                      <motion.tr 
                        key={u.uid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100">
                              {u.photoURL ? (
                                <img src={u.photoURL} alt={u.displayName} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-blue-600 font-bold text-sm">
                                  {u.displayName.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center text-sm">
                                {u.displayName}
                                {u.uid === currentUser?.uid && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded uppercase tracking-wider">You</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingId === u.uid ? (
                            <div className="flex items-center space-x-2">
                              <select 
                                defaultValue={u.role}
                                onChange={(e) => handleUpdateRole(u.uid, e.target.value as UserRole)}
                                className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              >
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:text-slate-600">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                u.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> :
                                 u.role === 'editor' ? <Edit3 className="w-3 h-3" /> :
                                 <Eye className="w-3 h-3" />}
                                <span>{u.role}</span>
                              </span>
                              <button 
                                onClick={() => setEditingId(u.uid)}
                                className="p-1 text-slate-300 hover:text-blue-600 transition-colors"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteUser(u.uid)}
                            disabled={u.uid === currentUser?.uid}
                            className="p-2 text-slate-300 hover:text-rose-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pending Invites */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-amber-500" />
            Pending Invites
          </h2>
          
          <div className="space-y-3">
            {pendingInvites.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center">
                <Mail className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No pending invitations</p>
              </div>
            ) : (
              pendingInvites.map((invite) => (
                <motion.div 
                  key={invite.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[140px]">{invite.email}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{invite.role}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRevokeInvite(invite.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => copyToClipboard(`${window.location.origin}?invite=${invite.id}`)}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowInviteModal(false);
                setLastInviteLink(null);
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Invite Member</h2>
                      <p className="text-xs text-slate-500">Send a secure invitation link</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setShowInviteModal(false);
                      setLastInviteLink(null);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {lastInviteLink ? (
                  <div className="space-y-4 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-blue-900">Invitation Created!</h3>
                      <p className="text-xs text-blue-700">Copy the link below and send it to the new member.</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-blue-200">
                      <input 
                        readOnly 
                        value={lastInviteLink}
                        className="flex-1 bg-transparent text-[10px] font-mono text-slate-600 outline-none px-2"
                      />
                      <button 
                        onClick={() => copyToClipboard(lastInviteLink)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        setShowInviteModal(false);
                        setLastInviteLink(null);
                      }}
                      className="w-full py-3 text-sm font-bold text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendInvite} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="email"
                          required
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="colleague@company.com"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Level</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['viewer', 'editor', 'admin'] as UserRole[]).map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setInviteRole(role)}
                            className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all ${
                              inviteRole === role 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' 
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isInviting}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {isInviting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          <span>Generate Invite Link</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
