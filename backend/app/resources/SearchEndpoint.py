import elasticsearch
import flask_restful
from flask import request, json

from app import elastic_index, RestException
from app.model.search import Facets, Facet, FacetCount, Hit
from app.resources.schema import SearchSchema


class SearchEndpoint(flask_restful.Resource):
    def post(self):
        request_data = request.get_json()
        search, errors = SearchSchema().load(request_data)

        if errors:
            raise RestException(RestException.INVALID_OBJECT, details=errors)
        try:
            results = elastic_index.search(search)
        except elasticsearch.ElasticsearchException as e:
            raise RestException(RestException.ELASTIC_ERROR, details=json.dumps(e.info))

        search.total = results.hits.total
        search.facets = []

        for name, member in Facets.__members__.items():
            if member.value in results.facets:
                facet = Facet(member.value)
                facet.facetCounts = []
                for category, hit_count, is_selected in results.facets[member.value]:
                    facet.facetCounts.append(FacetCount(category, hit_count, is_selected))
                search.facets.append(facet)

        search.hits = []
        for hit in results:
            highlights = ""
            if "highlight" in hit.meta:
                highlights = "... ".join(hit.meta.highlight.content)
            hit = Hit(hit.id, hit.content, hit.description, hit.title, hit.type, hit.label, hit.last_updated, highlights, hit.latitude, hit.longitude)
            search.hits.append(hit)

        return SearchSchema().jsonify(search)
