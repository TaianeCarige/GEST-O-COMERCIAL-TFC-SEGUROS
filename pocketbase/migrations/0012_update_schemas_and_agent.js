/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // Update mapeamentos rules
    const mapeamentos = app.findCollectionByNameOrId('mapeamentos')
    mapeamentos.listRule = "@request.auth.id != ''"
    mapeamentos.viewRule = "@request.auth.id != ''"

    if (!mapeamentos.fields.getByName('value')) {
      mapeamentos.fields.add(new NumberField({ name: 'value', min: 0 }))
    }
    app.save(mapeamentos)

    // Update users rules
    const users = app.findCollectionByNameOrId('users')
    if (!users.fields.getByName('callsGoal')) {
      users.fields.add(new NumberField({ name: 'callsGoal', min: 0 }))
    }
    if (!users.fields.getByName('visitsGoal')) {
      users.fields.add(new NumberField({ name: 'visitsGoal', min: 0 }))
    }
    app.save(users)

    // Define tfc-sales-advisor Agent
    $ai.agents.define(app, {
      slug: 'tfc-sales-advisor',
      name: 'TFC Sales Advisor',
      description: 'Especialista em contorno de objeções de vendas B2B.',
      systemPrompt:
        'Você é um consultor de vendas sênior da TFC Seguros. Sua tarefa é analisar a objeção do cliente fornecida e retornar a melhor estratégia, argumentos e script para contorná-la e fechar a venda. Seja direto, persuasivo e use técnicas avançadas de negociação B2B.',
      tier: 'reasoning',
    })
  },
  (app) => {
    const mapeamentos = app.findCollectionByNameOrId('mapeamentos')
    mapeamentos.listRule =
      "@request.auth.id != '' && (manager_id = @request.auth.id || @request.auth.role = 'manager')"
    mapeamentos.viewRule =
      "@request.auth.id != '' && (manager_id = @request.auth.id || @request.auth.role = 'manager')"
    app.save(mapeamentos)

    $ai.agents.delete(app, 'tfc-sales-advisor')
  },
)
