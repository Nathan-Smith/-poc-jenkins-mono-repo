

tree-test:
	docker-compose run --rm groovy make _tree-test

_tree-test:
	groovy tree-test.groovy