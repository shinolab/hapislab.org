import yaml from 'js-yaml';
import staffYaml from '../data/staff.yml?raw';
import studentsYaml from '../data/students.yml?raw';

export interface Staff {
	name: string;
	nameEn: string;
	role: string;
	roleEn: string;
	startDate: string;
	endDate?: string;
	email: string;
	href?: string;
}

export interface StudentDegree {
	start?: string;
	grad: string;
	thesis?: string;
	thesisEn?: string;
}

export interface StudentDegree {
	start?: string;
	grad: string;
	thesis?: string;
	thesisEn?: string;
}

export interface Student {
	name: string;
	nameEn: string;
	email?: string;
	href?: string;
	campus?: string; // Kashiwa or Hongo
	degrees: {
		B?: StudentDegree;
		M?: StudentDegree;
		D?: StudentDegree;
	};
}

export interface MemberData {
	staff: Staff[];
	students: Student[];
}

export const getMembers = (): MemberData => {
	const staff = yaml.load(staffYaml) as Staff[] || [];
	const students = yaml.load(studentsYaml) as Student[] || [];

	return { staff, students };
};

export type DegreeKey = 'B' | 'M' | 'D';

export interface AlumniEntry {
	name: string;
	nameEn: string;
	role: string;
	roleEn: string;
	gradDate: string;
	thesis?: string;
	thesisEn?: string;
	href?: string;
	type: 'student' | 'staff';
	sortOrder: number;
}

const STUDENT_ROLE_LABELS: Record<DegreeKey, { ja: string, en: string, order: number }> = {
	D: { ja: '博士', en: 'Ph.D.', order: 1 },
	M: { ja: '修士', en: 'Master', order: 2 },
	B: { ja: '学部', en: 'Bachelor', order: 3 },
};

export function processMembers(data: MemberData, now: Date = new Date()) {
	const currentStaff = data.staff.filter((s) => !s.endDate || new Date(s.endDate) > now);

	const activeStudents: Record<DegreeKey, Student[]> = {
		D: [],
		M: [],
		B: [],
	};

	const alumniByYear: Record<number, AlumniEntry[]> = {};

	const getFiscalYear = (dateStr: string) => {
		const date = new Date(dateStr);
		const year = date.getFullYear();
		const month = date.getMonth(); // 0 is January
		return month < 3 ? year - 1 : year;
	};

	// Process Staff Alumni
	data.staff.forEach((s) => {
		if (s.endDate && new Date(s.endDate) <= now) {
			const fy = getFiscalYear(s.endDate);
			if (!alumniByYear[fy]) alumniByYear[fy] = [];
			alumniByYear[fy].push({
				name: s.name,
				nameEn: s.nameEn,
				role: s.role,
				roleEn: s.roleEn,
				gradDate: s.endDate,
				href: s.href,
				type: 'staff',
				sortOrder: 0, // Staff first
			});
		}
	});

	// Process Student Alumni (Flattening the nested structure for display only)
	data.students.forEach((student) => {
		let isActive = false;
		if (student.degrees) {
			(Object.keys(student.degrees) as DegreeKey[]).forEach((dk) => {
				const d = student.degrees[dk];
				if (!d) return;

				const gradDate = d.grad ? new Date(d.grad) : null;
				if (!gradDate || gradDate > now) {
					isActive = true;
				} else {
					const fy = getFiscalYear(d.grad);
					
					if (!alumniByYear[fy]) alumniByYear[fy] = [];
					alumniByYear[fy].push({
						name: student.name,
						nameEn: student.nameEn,
						role: STUDENT_ROLE_LABELS[dk].ja,
						roleEn: STUDENT_ROLE_LABELS[dk].en,
						gradDate: d.grad,
						thesis: d.thesis,
						thesisEn: d.thesisEn,
						href: student.href,
						type: 'student',
						sortOrder: STUDENT_ROLE_LABELS[dk].order,
					});
				}
			});
		}

		if (isActive) {
			if (student.degrees.D && (!student.degrees.D.grad || new Date(student.degrees.D.grad) > now)) {
				activeStudents.D.push(student);
			} else if (student.degrees.M && (!student.degrees.M.grad || new Date(student.degrees.M.grad) > now)) {
				activeStudents.M.push(student);
			} else if (student.degrees.B && (!student.degrees.B.grad || new Date(student.degrees.B.grad) > now)) {
				activeStudents.B.push(student);
			}
		}
	});

	// Sort alumni within each year: Staff -> D -> M -> B, then by name
	Object.keys(alumniByYear).forEach((year) => {
		alumniByYear[Number(year)].sort((a, b) => {
			if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
			return a.name.localeCompare(b.name, 'ja');
		});
	});

	const sortedYears = Object.keys(alumniByYear)
		.map(Number)
		.sort((a, b) => b - a);

	return {
		staff: currentStaff,
		activeStudents,
		alumniYears: sortedYears,
		alumniByYear,
	};
}
