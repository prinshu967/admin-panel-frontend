export interface Role {
	id: string;
	name: string;
    description: string;
	isActive: boolean;
	createdOn?: string | null;
}
