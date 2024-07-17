import crypto from "crypto";
import { Entity } from "electrodb";
import { Table } from "sst/node/table";
import { ProjectRequest, ProjectResponse, ProjectUpdateRequest } from "../types/project";
import { client } from "./dynamo";

export const Project = new Entity(
	{
		model: {
			entity: "project",
			version: "1",
			service: "pms",
		},
		attributes: {
			projectId: {
				type: "string",
				readOnly: true,
				required: true,
				default: () => crypto.randomUUID(),
			},
			name: {
				type: "string",
				required: true,
			},
			description: {
				type: "string",
			},
			status: {
				type: "string",
				required: true,
				enum: ["pending", "completed"],
				default: "pending",
			},
			startDate: {
				type: "string",
				required: true,
			},
			endDate: {
				type: "string",
			},
			createdAt: {
				type: "string",
				readOnly: true,
				required: true,
				default: () => new Date().toISOString(),
				set: () => new Date().toISOString(),
			},
		},
		indexes: {
			primary: {
				pk: {
					field: "pk",
					composite: ["projectId"],
				},
				sk: {
					field: "sk",
					composite: [],
				},
			},
			byName: {
				index: "gsi1",
				pk: {
					field: "gsi1pk",
					composite: ["name"],
				},
				sk: {
					field: "gsi1sk",
					composite: [],
				},
			},
		},
	},
	{
		table: Table.pmsTable.tableName,
		client,
	}
);

export const getProject = async (projectId: string) => {
	const res = await Project.get({
		projectId: projectId,
	}).go();
	return res.data;
};

export const addProject = async (project: ProjectRequest) => {
	const res = await Project.create({
		name: project.name,
		description: project.description,
		startDate: project.startDate,
		endDate: project?.endDate,
	}).go();
	return res.data;
};

export const getProjectByName = async (
	name: string
): Promise<ProjectResponse[]> => {
	try {
		const res = await Project.query.byName({ name }).go();
		return res.data.map((item: any) => ({
			projectId: item.projectId,
			name: item.name,
			description: item.description,
			status: item.status,
			startDate: item.startDate,
			endDate: item.endDate,
			createdAt: item.createdAt,
		})) as ProjectResponse[];
	} catch (err) {
		console.log(JSON.stringify(err.message));
		throw err;
	}
};

export const listProjects = async (): Promise<ProjectResponse[]> => {
    try {
        const res = await Project.scan.go();
        return res.data.map((item: any) => ({
            projectId: item.projectId,
            name: item.name,
            description: item.description,
            status: item.status,
            startDate: item.startDate,
            endDate: item.endDate,
            createdAt: item.createdAt,
        })) as ProjectResponse[];
    } catch (err) {
        console.log(JSON.stringify(err.message));
        throw err;
    }
};
export const getProjectById = async (projectId: string): Promise<ProjectResponse | null> => {
    try {
        const res = await Project.get({ projectId }).go();

        if (!res.data) {
            return null;
        }

        return {
            projectId: res.data.projectId,
            name: res.data.name,
            description: res.data.description,
            status: res.data.status,
            startDate: res.data.startDate,
            endDate: res.data.endDate,
            createdAt: res.data.createdAt,
        };
    } catch (err) {
        console.error(JSON.stringify(err));
        throw err;
    }
};

export const updateProject = async (projectId: string, updateData: ProjectUpdateRequest): Promise<ProjectResponse | null> => {
    try {
        const res = await Project.update({ projectId })
            .set(updateData)
            .go({ response: 'all_new' });
        return res.data as ProjectResponse;
    } catch (err) {
        console.error(JSON.stringify(err));
        throw err;
    }
};

export const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
        await Project.delete({ projectId }).go();
        return true;
    } catch (err) {
        console.error(JSON.stringify(err));
        throw err;
    }
};

