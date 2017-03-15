package edu.dfci.singlecell.tsne.rest;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import edu.dfci.cccb.mev.dataset.rest.resolvers.AnalysisPathVariableMethodArgumentResolver;
import edu.dfci.singlecell.tsne.domain.Tsne;
import edu.dfci.singlecell.tsne.domain.TsneBuilder;

@Configuration
@ComponentScan ("edu.dfci.singlecell.tsne.rest.controllers")
public class TsneConfiguration {

  @Bean
  @Scope ("prototype")
  TsneBuilder tsneBuilder () {
    return new TsneBuilder ();
  }

  @Bean
  AnalysisPathVariableMethodArgumentResolver<Tsne> tsneResolver () {
    return new AnalysisPathVariableMethodArgumentResolver<> (Tsne.class);
  }
}
