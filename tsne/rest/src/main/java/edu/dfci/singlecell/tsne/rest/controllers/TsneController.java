package edu.dfci.singlecell.tsne.rest.controllers;

import static edu.dfci.cccb.mev.dataset.rest.resolvers.DatasetPathVariableMethodArgumentResolver.DATASET_URL_ELEMENT;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.context.WebApplicationContext.SCOPE_REQUEST;

import javax.inject.Inject;
import javax.inject.Provider;
import edu.dfci.singlecell.tsne.domain.Tsne;
import edu.dfci.singlecell.tsne.domain.Tsne.TsneParams;
import edu.dfci.singlecell.tsne.domain.TsneBuilder;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.*;
import edu.dfci.cccb.mev.dataset.domain.contract.Analysis;
import edu.dfci.cccb.mev.dataset.domain.contract.Dataset;
import edu.dfci.cccb.mev.dataset.domain.contract.DatasetException;
import com.fasterxml.jackson.annotation.JsonProperty;

@RestController
@RequestMapping ("/dataset/" + DATASET_URL_ELEMENT)
@Scope (SCOPE_REQUEST)
public class TsneController{
  private @Inject Dataset dataset;
  private @Inject Provider<TsneBuilder> tsne;

  @RequestMapping (value = "/analyze/tsne/{name}", method = RequestMethod.PUT)
  @ResponseStatus (OK)
  public Analysis start (@RequestBody Tsne.TsneParams params) throws DatasetException {
    return tsne.get ()
               .name(params.name())
               .perplexity (params.perplexity())
               .dims (params.dims())
               .buildAsync ();
  }
}

