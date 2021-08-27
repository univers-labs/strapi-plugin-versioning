const { pluginId } = require('../../utils');

module.exports = (strapi) => ({
  initialize() {
    const VALID_ADMIN_URLS = [
      /\/content-manager\/collection-types\/application/,
      /\/content-manager\/single-types\/application/,
    ];
    const versioningPlugin = strapi.plugins[pluginId];
    const versioningService = versioningPlugin.services.versioning;
    const versionModel = strapi.query('version', pluginId);

    const newVersionMethods = ['PUT', 'POST'];
    const shouldCreateVersion = (ctx, model) => (
      VALID_ADMIN_URLS.some(pattern => pattern.test(ctx.request.url)) &&
      newVersionMethods.includes(ctx.request.method) &&
      model && ctx.response.message === 'OK'
    );

    strapi.app.use(async (ctx, next) => {
      await next();
      const model = ctx?.params?.model;
      const id = ctx?.params?.id ?? ctx?.response?.body?.id;
      const strapiModel = versioningService.getStrapiModel(model);
      if (id && shouldCreateVersion(ctx, strapiModel)) {
        const entry = await versioningService.getEntryVersion(strapiModel, id);
        const versionEntry = versioningService.getVersionEntry(strapiModel, entry);
        await versionModel.create(versionEntry);
      }
    });
  }
});
