package edu.dfci.singlecell.tsne.domain;

import java.util.Map;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.Accessors;
import edu.dfci.cccb.mev.dataset.domain.prototype.AbstractAnalysis;

@NoArgsConstructor
@Accessors(fluent = true)
public class Tsne extends AbstractAnalysis<Tsne> {

  @Accessors(fluent = true)  
  @AllArgsConstructor
  @NoArgsConstructor
  public static  class TsneParams{
    @JsonProperty @Getter String name;
    @JsonProperty @Getter int perplexity;
    @JsonProperty @Getter int  dims;  
  }

  private @JsonProperty @Getter Map<String, Map<String, Double> > y;
  private @JsonProperty @Getter double theta;
  private @JsonProperty @Getter int perplexity;
  private @JsonProperty @Getter Map<String, Double> costs;

  @Override
  @JsonProperty
  public String type () {
    return "tsne";
  }
}
