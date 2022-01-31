VIRTUALENV_DIR ?= ./env
PYTHON ?= python3
PIP=$(VIRTUALENV_DIR)/bin/pip
VIRTUAL_PYTHON=$(VIRTUALENV_DIR)/bin/python
VIRTUALENV_BIN=$(PYTHON) -m venv
REQUIREMENTS ?= requirements.txt

all: help

.PHONY: run
run: ## Runs the server
	python src/server.py

.PHONY: install
install: bootstrap ## Installs dependencies from requirements.txt
	$(PIP) install -r $(REQUIREMENTS)

.PHONY: bootstrap
bootstrap: clean $(VIRTUALENV_DIR) install ## Set up virtual environment

.PHONY: clean
clean:  ## clear the virtual environment
	rm -rf $(VIRTUALENV_DIR)
	touch $(REQUIREMENTS)

$(VIRTUALENV_DIR):
	$(VIRTUALENV_BIN) $(VIRTUALENV_DIR) 

# via https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help: ## Documentation help for Makefile commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

