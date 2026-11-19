.PHONY: help setup lint format test check
help:
	@echo "make setup   install api and web dependencies"
	@echo "make lint    run linters"
	@echo "make format  auto-format code"
	@echo "make test    run all tests"
	@echo "make check   lint + typecheck + test (what CI runs)"
setup:
	cd apps/api && python -m venv .venv && . .venv/bin/activate && pip install -e ".[dev]"
	pnpm install
lint:
	cd apps/api && ruff check . && ruff format --check .
	pnpm lint
format:
	cd apps/api && ruff check --fix . && ruff format .
	pnpm format
test:
	cd apps/api && pytest
	pnpm test
check: lint
	cd apps/api && mypy
	pnpm typecheck
	$(MAKE) test
