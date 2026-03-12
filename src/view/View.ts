export class View {
  protected replaceTemplate(template: string, data: Record<string, string | number>) {
    let result = template;

    for (const [key, value] of Object.entries(data)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }

    return result;
  }
}
