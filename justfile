NODE := "docker compose exec node"
PNPM := NODE + " pnpm"

reset:
    {{ PNPM }} -F "@bookeez/api" ace db:wipe
    {{ PNPM }} -F "@bookeez/api" ace db:migrate
    {{ PNPM }} -F "@bookeez/api" ace app:defaults

api +args:
    {{ PNPM }} -F "@bookeez/api" {{ args }}

front +args:
    {{ PNPM }} -F "@bookeez/front" {{ args }}

ace *args:
    {{ PNPM }} -F "@bookeez/api" ace {{ args }}

shell:
    docker compose exec -it node bash

pnpm +args:
    {{ PNPM }} {{ args }}

ncu:
    {{ NODE }} ncu -iu
