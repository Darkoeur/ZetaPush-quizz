export interface ServerRoom {
    // How a room is defined on server-side
    id: string;
    deploymentId: string;
    name: string;
    owner: ServerMember;
    resource: string;
    members: Array<ServerMember>;
    metadata: ServerMetadata;
    tags: Array<string>;
}

export interface ServerMember {
    userKey: string;
    login?: string;
    score?: number;
}

export interface ServerMetadata {
    creator?: string;
    openDelay?: number;
    open: boolean;
    password?: string;
    createdAt: number;
    closedAt?: number;
    type: string;
}



// Interface used by the leaveRoom macro

export interface ServerLeaveRequest {
    leave: ServerJoinResult;
}

// Interfaces used by the joinRoom macro

export interface ServerJoinRequest {
    isOpen: boolean;
    join: ServerJoinResult;
    members: Array<ServerMember>;
}

export interface ServerJoinResult {
    id: string;
    member: string;
}
