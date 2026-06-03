import prisma from '../lib/prisma';

export interface FormFieldInput {
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: string; // JSON string for dropdown/radio/checkbox
  order?: number;
}

export interface CreateFormInput {
  title: string;
  description?: string;
  createdById: number;
  fields?: FormFieldInput[];
}

export const findAllForms = async (publishedOnly = false) => {
  return prisma.form.findMany({
    where: publishedOnly ? { isPublished: true } : {},
    include: { fields: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const findFormById = async (id: number) => {
  return prisma.form.findUnique({
    where: { id },
    include: { fields: { orderBy: { order: 'asc' } } },
  });
};

export const createForm = async (input: CreateFormInput) => {
  return prisma.form.create({
    data: {
      title: input.title,
      description: input.description,
      createdById: input.createdById,
      fields: input.fields
        ? { create: input.fields.map((f, i) => ({ ...f, order: f.order ?? i })) }
        : undefined,
    },
    include: { fields: { orderBy: { order: 'asc' } } },
  });
};

export const updateForm = async (
  id: number,
  data: { title?: string; description?: string; isPublished?: boolean },
) => {
  return prisma.form.update({
    where: { id },
    data,
    include: { fields: { orderBy: { order: 'asc' } } },
  });
};

export const deleteForm = async (id: number) => {
  return prisma.form.delete({ where: { id } });
};

// Field management
export const addFormField = async (formId: number, field: FormFieldInput) => {
  const count = await prisma.formField.count({ where: { formId } });
  return prisma.formField.create({
    data: { formId, ...field, order: field.order ?? count },
  });
};

export const updateFormField = async (fieldId: number, data: Partial<FormFieldInput>) => {
  return prisma.formField.update({ where: { id: fieldId }, data });
};

export const deleteFormField = async (fieldId: number) => {
  return prisma.formField.delete({ where: { id: fieldId } });
};

export const reorderFormFields = async (fields: { id: number; order: number }[]) => {
  const updates = fields.map(({ id, order }) =>
    prisma.formField.update({ where: { id }, data: { order } }),
  );
  return prisma.$transaction(updates);
};

export const countForms = async () => {
  return prisma.form.count();
};
