package edu.dfci.cccb.mev.gsea.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties (ignoreUnknown = true)
public class LimmaEntry {

  private @JsonProperty ("SYMBOL") String symbol;
  private @JsonProperty double logFC;
  private @JsonProperty ("AveExpr") double averageExpression;
  private @JsonProperty double t;
  private @JsonProperty ("PValue") double pValue;
  private @JsonProperty ("adjPVal") double pAdjust;
}
