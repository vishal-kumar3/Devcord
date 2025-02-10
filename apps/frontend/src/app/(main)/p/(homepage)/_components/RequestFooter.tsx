import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSocket } from "@/providers/socket.provider";
import { FriendRequestStatus } from "@prisma/client";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

export type RequestFooterAction = {
  updateRequest: (params: { friendId: string, status: FriendRequestStatus }) => Promise<{ data: any; error: any }>;
  status?: FriendRequestStatus;
  icon?: {
    src: string;
    alt: string;
  }
  tooltipContent?: string;
  actionNode?: React.ReactNode
  friendId: string;
  socketEvent: (socket: Socket, data: any) => void;
}

export const RequestFooter = <T extends { id: string }>({
  setRequests,
  actions,
  socket
}: {
  setRequests: Dispatch<SetStateAction<T[]>>;
  actions: RequestFooterAction[];
  socket: Socket | null;
}) => {
  return (
    <div className="flex space-x-4">
      {actions.map((action, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={async () => {
                  const { data, error } = await action.updateRequest({ friendId: action.friendId, status: action.status! });
                  if (!data || error) {
                    return toast.error(error || `Failed to process request`);
                  }
                  if (socket) {
                    action.socketEvent(socket, data);
                  }
                  setRequests((prev) => prev.filter((req) => req.id !== data.id));
                  return
                }}
                className="btn btn-secondary aspect-square"
              >
                {
                  action.actionNode && action.actionNode
                }
                {
                  action.icon && (
                    <Image
                      src={action.icon.src}
                      alt={action.icon.alt}
                      width={35}
                      height={35}
                      className="size-[35px] aspect-square rounded-full bg-back-four hover:bg-back-three"
                    />
                  )
                }
              </button>
            </TooltipTrigger>
            {
              action.tooltipContent && (
                <TooltipContent sideOffset={10}>
                  <p className="text-base">{action.tooltipContent}</p>
                </TooltipContent>
              )
            }
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
