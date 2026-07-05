// Tipos de usuario válidos en el registro / cambio de tipo (contrato api-graduados).
// Solo estos 4: 2 Graduado UBA, 4 Graduado otra universidad, 6 Título en trámite, 5 Otros.
// (Se quitaron los antiguos "Alumno UBA" (1) y "Alumno otra universidad" (3).)

export interface UserType {
  id: number;
  label: string;
}

export const USER_TYPES: UserType[] = [
  { id: 2, label: "Graduado (UBA)" },
  { id: 4, label: "Graduado (otra universidad)" },
  { id: 6, label: "Título en trámite (UBA)" },
  { id: 5, label: "Otros" },
];

// Tipos "graduado" que tienen validación de tipo (badge / pantalla "validá tu tipo").
// "Otros" (5) no tiene privilegios y queda siempre aprobado.
export const isGraduateType = (typeId: number): boolean =>
  [2, 4, 6].includes(Number(typeId));

// Solo "Graduado otra universidad" adjunta documento para validar.
export const isOtherUniversity = (typeId: number): boolean =>
  Number(typeId) === 4;

export const typeLabel = (typeId: number): string =>
  USER_TYPES.find((t) => t.id === Number(typeId))?.label ?? "";
