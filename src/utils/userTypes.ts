// Tipos de usuario válidos en el registro / cambio de tipo (contrato api-graduados).
// Solo estos 3: 2 Graduado UBA, 4 Graduado otra universidad, 6 Título en trámite.
// (Se quitaron los antiguos "Alumno UBA" (1), "Alumno otra universidad" (3) y "Otros" (5).)

export interface UserType {
  id: number;
  label: string;
}

export const USER_TYPES: UserType[] = [
  { id: 2, label: "Graduado (UBA)" },
  { id: 4, label: "Graduado (otra universidad)" },
  { id: 6, label: "Título en trámite (UBA)" },
];

// Tipos "graduado" que tienen validación de tipo (badge / pantalla "validá tu tipo").
export const isGraduateType = (typeId: number): boolean =>
  [2, 4, 6].includes(Number(typeId));

// Solo "Graduado otra universidad" adjunta documento para validar.
export const isOtherUniversity = (typeId: number): boolean =>
  Number(typeId) === 4;

export const typeLabel = (typeId: number): string =>
  USER_TYPES.find((t) => t.id === Number(typeId))?.label ?? "";
