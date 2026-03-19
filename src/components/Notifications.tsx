import React from 'react';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { cn } from '../utils';

const NotificationItem = ({ type, title, description, time, unread }: any) => {
  const icons: any = {
    alert: { icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    success: { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    info: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    user: { icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  };

  const { icon: Icon, color, bg } = icons[type] || icons.info;

  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all cursor-pointer group",
      unread ? "bg-white border-slate-200 shadow-sm" : "bg-transparent border-transparent hover:bg-slate-50"
    )}>
      <div className="flex items-start">
        <div className={cn("p-2 rounded-xl mr-4", bg)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={cn("text-sm font-bold truncate", unread ? "text-slate-900" : "text-slate-600")}>
              {title}
            </h4>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{time}</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{description}</p>
          <div className="mt-3 flex items-center text-[10px] font-bold text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </div>
        </div>
        {unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-2"></div>}
      </div>
    </div>
  );
};

export const Notifications = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Stay updated on contract milestones and team activity.</p>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 w-fit">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        <div className="px-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Today</h3>
          <div className="space-y-3">
            <NotificationItem 
              type="alert"
              title="Contract Expiring Soon"
              description="The 'Office Lease - Kumasi' contract with Consar Limited is set to expire in 30 days. Action required."
              time="2 hours ago"
              unread={true}
            />
            <NotificationItem 
              type="success"
              title="Contract Approved"
              description="Kwame Mensah approved the 'Software License Agreement' for AmaliTech Ghana."
              time="5 hours ago"
              unread={true}
            />
          </div>
        </div>

        <div className="px-2 pt-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Yesterday</h3>
          <div className="space-y-3">
            <NotificationItem 
              type="pending"
              title="Review Requested"
              description="Abena Osei requested your review on 'Marketing Services MSA' draft."
              time="1 day ago"
              unread={false}
            />
            <NotificationItem 
              type="user"
              title="New Team Member"
              description="Kofi Boateng has been added to the Legal Counsel team."
              time="1 day ago"
              unread={false}
            />
          </div>
        </div>

        <div className="px-2 pt-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Earlier this week</h3>
          <div className="space-y-3">
            <NotificationItem 
              type="info"
              title="System Update"
              description="LexisManage has been updated to version 2.4.0 with improved analytics."
              time="3 days ago"
              unread={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
