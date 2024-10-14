NODE := "docker compose exec node"
PNPM := NODE + " pnpm"

api +args:
    {{PNPM}} -F "@bookeez/api" {{args}}

ace *args:
    {{PNPM}} -F "@bookeez/api" ace {{args}}

shell:
    docker compose exec -it node bash

pnpm +args:
    {{PNPM}} {{args}}

ncu:
	{{NODE}} ncu -iu
