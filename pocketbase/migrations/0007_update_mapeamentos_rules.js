migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('mapeamentos')
    col.createRule = "@request.auth.id != ''"
    col.updateRule =
      "@request.auth.id != '' && (manager_id = @request.auth.id || @request.auth.role = 'manager')"
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('mapeamentos')
    col.createRule = "@request.auth.id != ''"
    col.updateRule =
      "@request.auth.id != '' && (manager_id = @request.auth.id || @request.auth.role = 'manager')"
    app.save(col)
  },
)
